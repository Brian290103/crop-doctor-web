import Link from "next/link";
import {
  Brain,
  Layers,
  MessageSquare,
  Plus,
  Sprout,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getDashboardStats, getCropsData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex size-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="size-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

export default async function DashboardOverview() {
  const [stats, crops] = await Promise.all([
    getDashboardStats(),
    getCropsData(),
  ]);

  const statCards = [
    {
      title: "Total Crops",
      value: stats.totalCrops,
      description: "Crop categories in knowledge base",
      icon: Sprout,
      color: "bg-green-500",
    },
    {
      title: "Total Sources",
      value: stats.totalSources,
      description: "Knowledge base articles & documents",
      icon: Layers,
      color: "bg-blue-500",
    },
    {
      title: "Trained Sources",
      value: stats.trainedSources,
      description: "Sources with active embeddings",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      title: "Needs Training",
      value: stats.untrainedSources,
      description: "Sources awaiting embedding training",
      icon: Brain,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your CropDoctor AI knowledge base
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/dashboard/chat">
              <MessageSquare className="size-4" />
              Test AI Chat
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/dashboard/sources">
              <Plus className="size-4" />
              Manage Sources
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Crops List */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Crops</CardTitle>
              <CardDescription className="text-xs">
                Knowledge base categories
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs h-7">
              <Link href="/dashboard/sources">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {crops.length > 0 ? (
              <ul className="space-y-1">
                {crops.slice(0, 8).map((crop) => (
                  <li key={crop.id}>
                    <Link
                      href={`/dashboard/sources/${crop.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors group"
                    >
                      <Sprout className="size-3.5 text-green-600 shrink-0" />
                      <span className="font-medium text-foreground/80 group-hover:text-foreground truncate">
                        {crop.name}
                      </span>
                    </Link>
                  </li>
                ))}
                {crops.length > 8 && (
                  <li className="px-3 py-1">
                    <span className="text-xs text-muted-foreground">
                      +{crops.length - 8} more crops
                    </span>
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sprout className="size-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No crops yet</p>
                <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                  <Link href="/dashboard/sources">Add your first crop →</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription className="text-xs">
              Common tasks to manage your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/sources"
                className="group flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-150"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Layers className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Manage Sources</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    View, add, and train knowledge sources
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/chat"
                className="group flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-150"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Test AI Chat</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Try the crop disease diagnosis AI
                  </p>
                </div>
              </Link>

              <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-4 opacity-50 cursor-not-allowed">
                <div className="flex size-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    Analytics
                    <Badge variant="secondary" className="text-xs py-0 h-4">Soon</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Usage stats and AI performance
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-border p-4 opacity-50 cursor-not-allowed">
                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Brain className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2">
                    Bulk Training
                    <Badge variant="secondary" className="text-xs py-0 h-4">Soon</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Train all untrained sources at once
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
