# Dashboard Standardization Updates

## Admin Dashboard Changes Needed

### Import Updates (line ~10-13)
Replace:
```tsx
import { DashboardFilters } from "./shared/dashboard-filters";
// Charts removed in favor of simpler visuals
import { Users, UserCheck, Clock, CheckCircle } from "lucide-react";
```

With:
```tsx
import { DashboardFilters } from "./shared/dashboard-filters";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Users, UserCheck, Clock, CheckCircle } from "lucide-react";
```

### First Section Update (line ~150-176)
Replace the "Monthly users summary table" Card with:

```tsx
        {/* Pie chart: user types distribution */}
        <Card className="xl:col-span-8 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Distribuição de Usuários</CardTitle>
            <CardDescription>Por tipo de usuário (valores exatos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full overflow-visible">
              {(() => {
                const pieData = [
                  { name: "Clientes", value: data.users.clients, color: "#2563eb" },
                  { name: "Prestadores", value: data.users.providers, color: "#16a34a" },
                  { name: "Administradores", value: data.users.admins, color: "#f59e0b" },
                ];
                return (
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 12, right: 48, bottom: 12, left: 48 }}>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            label={false}
                            labelLine={false}
                            isAnimationActive
                            animationBegin={150}
                            animationDuration={850}
                            animationEasing="ease-out"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#ffffff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number | string, name: string) => [String(value), name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {(() => {
                        const total = pieData.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
                        return pieData.map((d) => {
                          const pct = total ? Math.round((d.value / total) * 100) : 0;
                          return (
                            <div
                              key={d.name}
                              className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm transition-colors hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: d.color }}
                                />
                                <span className="font-medium">{d.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="tabular-nums font-semibold">{d.value}</span>
                                <span className="text-xs text-muted-foreground">{pct}%</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
```

---

## Client Dashboard Changes Needed

### Import Updates (line ~10-12)
Replace:
```tsx
import { DashboardFilters } from "./shared/dashboard-filters";
// Charts removed in favor of simpler visuals
import { ShoppingCart, Clock, Heart, Star } from "lucide-react";
```

With:
```tsx
import { DashboardFilters } from "./shared/dashboard-filters";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ShoppingCart, Clock, Heart, Star } from "lucide-react";
```

### First Section Update (similar to line ~140-165 in client)
Replace the "Monthly requests summary table" Card with:

```tsx
        {/* Pie chart: categories distribution */}
        <Card className="xl:col-span-8 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Serviços por Categoria</CardTitle>
            <CardDescription>Distribuição dos seus serviços (valores exatos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full overflow-visible">
              {(() => {
                const entries = Object.entries(data.categoriesDistribution);
                const colors = [
                  "#2563eb", "#16a34a", "#f59e0b", "#e11d48", "#8b5cf6", "#06b6d4"
                ];
                const pieData = entries.map(([name, value], idx) => ({
                  name,
                  value: value as number,
                  color: colors[idx % colors.length],
                }));
                return (
                  <div className="h-full flex flex-col">
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 12, right: 48, bottom: 12, left: 48 }}>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            label={false}
                            labelLine={false}
                            isAnimationActive
                            animationBegin={150}
                            animationDuration={850}
                            animationEasing="ease-out"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                stroke="#ffffff"
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number | string, name: string) => [String(value), name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {(() => {
                        const total = pieData.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
                        return pieData.map((d) => {
                          const pct = total ? Math.round((d.value / total) * 100) : 0;
                          return (
                            <div
                              key={d.name}
                              className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm transition-colors hover:bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: d.color }}
                                />
                                <span className="font-medium">{d.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="tabular-nums font-semibold">{d.value}</span>
                                <span className="text-xs text-muted-foreground">{pct}%</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
```

---

## Summary

All three dashboards will now have:
- Vibrant animated pie charts (no slice labels)
- Card-style legend with colors, names, counts and percentages
- Consistent spacing and styling
- White separators between slices
- Smooth entry animation (850ms ease-out)
- Tooltip showing exact values
