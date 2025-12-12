import { prisma } from "@/lib/prisma";

/**
 * Determina qual usuário deve ser mantido em um merge
 * Prefere o usuário mais antigo, e em caso de empate, o que tem mais dados
 */
function determineTargetUser(
  user1: { id: string; createdAt: Date; email: string | null; phoneE164: string | null; cpf: string | null },
  user2: { id: string; createdAt: Date; email: string | null; phoneE164: string | null; cpf: string | null }
): { targetId: string; sourceId: string } {
  // Preferir o usuário mais antigo
  if (user1.createdAt < user2.createdAt) {
    return { targetId: user1.id, sourceId: user2.id };
  }
  if (user2.createdAt < user1.createdAt) {
    return { targetId: user2.id, sourceId: user1.id };
  }

  // Em caso de empate, preferir o que tem mais dados
  const user1DataCount = [user1.email, user1.phoneE164, user1.cpf].filter(Boolean).length;
  const user2DataCount = [user2.email, user2.phoneE164, user2.cpf].filter(Boolean).length;

  if (user1DataCount > user2DataCount) {
    return { targetId: user1.id, sourceId: user2.id };
  }
  if (user2DataCount > user1DataCount) {
    return { targetId: user2.id, sourceId: user1.id };
  }

  // Se ainda empatar, manter o primeiro
  return { targetId: user1.id, sourceId: user2.id };
}

/**
 * Unifica dois usuários, migrando todos os relacionamentos do usuário fonte para o usuário alvo
 * @param targetUserId ID do usuário que será mantido
 * @param sourceUserId ID do usuário que será excluído após migração
 * @returns O ID do usuário mantido
 */
export async function mergeUsers(
  targetUserId: string,
  sourceUserId: string
): Promise<string> {
  console.log(`Iniciando merge de usuários: ${sourceUserId} -> ${targetUserId}`);

  return await prisma.$transaction(async (tx) => {
    // Buscar ambos os usuários para verificar dados
    const targetUser = await tx.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        phoneE164: true,
        whatsappId: true,
        cpf: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    const sourceUser = await tx.user.findUnique({
      where: { id: sourceUserId },
      select: {
        id: true,
        email: true,
        phoneE164: true,
        whatsappId: true,
        cpf: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    if (!targetUser || !sourceUser) {
      throw new Error("Um ou ambos os usuários não foram encontrados");
    }

    // Determinar qual usuário realmente manter (pode ser diferente do que foi passado)
    const { targetId, sourceId } = determineTargetUser(targetUser, sourceUser);
    
    // Se a ordem mudou, atualizar as variáveis
    const finalTargetId = targetId;
    const finalSourceId = sourceId;
    
    const finalTarget = targetId === targetUserId ? targetUser : sourceUser;
    const finalSource = sourceId === sourceUserId ? sourceUser : targetUser;

    console.log(`Mantendo usuário ${finalTargetId}, excluindo ${finalSourceId}`);

    // Atualizar dados do usuário alvo com dados do usuário fonte (se não existirem)
    const updateData: {
      phoneE164?: string;
      whatsappId?: string;
      cpf?: string;
      name?: string;
      image?: string;
    } = {};

    if (!finalTarget.phoneE164 && finalSource.phoneE164) {
      updateData.phoneE164 = finalSource.phoneE164;
    }
    if (!finalTarget.whatsappId && finalSource.whatsappId) {
      updateData.whatsappId = finalSource.whatsappId;
    }
    if (!finalTarget.cpf && finalSource.cpf) {
      updateData.cpf = finalSource.cpf;
    }
    if (!finalTarget.name && finalSource.name) {
      updateData.name = finalSource.name;
    }
    if (!finalTarget.image && finalSource.image) {
      updateData.image = finalSource.image;
    }

    if (Object.keys(updateData).length > 0) {
      await tx.user.update({
        where: { id: finalTargetId },
        data: updateData,
      });
      console.log(`Dados atualizados no usuário alvo:`, updateData);
    }

    // Migrar todos os relacionamentos
    // Auth relations
    await tx.account.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    await tx.session.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    // Verificar e migrar userRoles (pode ter duplicatas)
    const sourceRoles = await tx.userRoleAssignment.findMany({
      where: { userId: finalSourceId },
    });

    for (const role of sourceRoles) {
      // Verificar se já existe essa role no target
      const existingRole = await tx.userRoleAssignment.findUnique({
        where: {
          userId_roleId: {
            userId: finalTargetId,
            roleId: role.roleId,
          },
        },
      });

      if (!existingRole) {
        // Migrar a role
        await tx.userRoleAssignment.update({
          where: { id: role.id },
          data: { userId: finalTargetId },
        });
      } else {
        // Se já existe, apenas deletar a duplicata
        await tx.userRoleAssignment.delete({
          where: { id: role.id },
        });
      }
    }

    // PostgreSQL relations
    await tx.address.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    await tx.providerRequest.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    await tx.providerRequest.updateMany({
      where: { reviewedBy: finalSourceId },
      data: { reviewedBy: finalTargetId },
    });

    // ProviderProfile é 1:1, então precisa verificar se já existe
    const sourceProfile = await tx.providerProfile.findUnique({
      where: { userId: finalSourceId },
    });
    const targetProfile = await tx.providerProfile.findUnique({
      where: { userId: finalTargetId },
    });

    if (sourceProfile && !targetProfile) {
      await tx.providerProfile.update({
        where: { userId: finalSourceId },
        data: { userId: finalTargetId },
      });
    } else if (sourceProfile && targetProfile) {
      // Se ambos existem, deletar o do source (manter o do target)
      await tx.providerProfile.delete({
        where: { userId: finalSourceId },
      });
    }

    await tx.providerAvailability.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.providerCategory.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.providerPayout.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.clientCredit.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    // Order relations
    await tx.order.updateMany({
      where: { clientId: finalSourceId },
      data: { clientId: finalTargetId },
    });

    await tx.order.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.orderInvitation.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.orderReview.updateMany({
      where: { clientId: finalSourceId },
      data: { clientId: finalTargetId },
    });

    await tx.orderReview.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.orderStatusHistory.updateMany({
      where: { byUserId: finalSourceId },
      data: { byUserId: finalTargetId },
    });

    await tx.matchScore.updateMany({
      where: { providerId: finalSourceId },
      data: { providerId: finalTargetId },
    });

    await tx.emailVerificationCode.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    await tx.passwordResetToken.updateMany({
      where: { userId: finalSourceId },
      data: { userId: finalTargetId },
    });

    // Excluir o usuário fonte
    await tx.user.delete({
      where: { id: finalSourceId },
    });

    console.log(`Merge concluído. Usuário ${finalSourceId} excluído, dados migrados para ${finalTargetId}`);

    return finalTargetId;
  });
}








