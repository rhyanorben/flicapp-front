"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ExternalLink, Edit2, Check, X as XIcon } from "lucide-react";

export interface PortfolioLink {
  url: string;
  title: string;
}

interface PortfolioLinksProps {
  links: PortfolioLink[];
  onChange: (links: PortfolioLink[]) => void;
  disabled?: boolean;
}

export function PortfolioLinks({
  links,
  onChange,
  disabled,
}: PortfolioLinksProps) {
  const [newLink, setNewLink] = useState({ url: "", title: "" });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLink, setEditLink] = useState({ url: "", title: "" });

  const addLink = () => {
    if (!newLink.url || !newLink.title) return;

    // Validate URL
    try {
      new URL(newLink.url);
    } catch {
      return; // Invalid URL
    }

    onChange([...links, newLink]);
    setNewLink({ url: "", title: "" });
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    onChange(updatedLinks);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditLink(links[index]);
  };

  const saveEdit = () => {
    if (!editLink.url || !editLink.title) return;

    // Validate URL
    try {
      new URL(editLink.url);
    } catch {
      return; // Invalid URL
    }

    const updatedLinks = links.map((link, index) =>
      index === editingIndex ? editLink : link
    );
    onChange(updatedLinks);
    setEditingIndex(null);
    setEditLink({ url: "", title: "" });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditLink({ url: "", title: "" });
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Links de Portfólio</h3>
          <p className="text-xs text-muted-foreground">
            Adicione links para seus trabalhos (máx. 5 links)
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {links.length}/5
        </Badge>
      </div>

      {/* Add new link form */}
      {links.length < 5 && (
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Título do Link
                  </label>
                  <Input
                    placeholder="Ex: Site Pessoal, Projeto XYZ"
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    disabled={disabled}
                    maxLength={50}
                  />
                  <div className="text-xs text-muted-foreground">
                    {newLink.title.length}/50 caracteres
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    URL
                  </label>
                  <Input
                    placeholder="https://exemplo.com"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
                    }
                    disabled={disabled}
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground">
                    {newLink.url.length}/200 caracteres
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={addLink}
                disabled={
                  disabled ||
                  !newLink.url ||
                  !newLink.title ||
                  links.length >= 5
                }
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links list */}
      {links.length > 0 && (
        <div className="space-y-2">
          {links.map((link, index) => (
            <Card key={index} className="relative group">
              <CardContent className="pt-3">
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          Título
                        </label>
                        <Input
                          value={editLink.title}
                          onChange={(e) =>
                            setEditLink({ ...editLink, title: e.target.value })
                          }
                          disabled={disabled}
                          maxLength={50}
                        />
                        <div className="text-xs text-muted-foreground">
                          {editLink.title.length}/50 caracteres
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                          URL
                        </label>
                        <Input
                          value={editLink.url}
                          onChange={(e) =>
                            setEditLink({ ...editLink, url: e.target.value })
                          }
                          disabled={disabled}
                          maxLength={200}
                        />
                        <div className="text-xs text-muted-foreground">
                          {editLink.url.length}/200 caracteres
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={saveEdit}
                        size="sm"
                        disabled={!editLink.url || !editLink.title}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        onClick={cancelEdit}
                        size="sm"
                        variant="outline"
                      >
                        <XIcon className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">
                          {link.title}
                        </h4>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {formatUrl(link.url)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        onClick={() => startEdit(index)}
                        size="sm"
                        variant="ghost"
                        disabled={disabled}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeLink(index)}
                        size="sm"
                        variant="ghost"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {links.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">Nenhum link adicionado ainda</p>
          <p className="text-xs">
            Adicione links para seus trabalhos e projetos
          </p>
        </div>
      )}
    </div>
  );
}
