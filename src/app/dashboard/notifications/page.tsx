import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Info, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Apples Nearing Spoilage",
      message: "Batch of Gala Apples (INV-001) in Chamber A is nearing spoilage (freshness score at 42%). Recommend immediate shipping.",
      time: "20 minutes ago",
      type: "warning",
      icon: Clock,
      read: false
    },
    {
      id: 2,
      title: "Storage Temperature Exceeded",
      message: "Storage temperature in Chamber C exceeds the recommended range (currently at 21.4°C, threshold is 10-15°C). Please adjust cooling.",
      time: "1 hour ago",
      type: "destructive",
      icon: AlertTriangle,
      read: false
    },
    {
      id: 3,
      title: "Weekly Freshness Report Available",
      message: "The weekly freshness and waste reduction report is compiled and available for export.",
      time: "3 hours ago",
      type: "info",
      icon: Info,
      read: false
    },
    {
      id: 4,
      title: "Image Scan Completed",
      message: "New image of Watermelon successfully analyzed by AI model. Freshness score: 92%, status: Fresh.",
      time: "5 hours ago",
      type: "success",
      icon: CheckCircle2,
      read: true
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Alerts, warnings, and system updates.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1 cursor-pointer hover:bg-muted">Mark all as read</Badge>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          const isUnread = !notif.read;
          
          let iconColor = "text-blue-500";
          let iconBg = "bg-blue-500/10";
          
          if (notif.type === "warning") {
            iconColor = "text-warning";
            iconBg = "bg-warning/10";
          } else if (notif.type === "destructive") {
            iconColor = "text-destructive";
            iconBg = "bg-destructive/10";
          } else if (notif.type === "success") {
            iconColor = "text-primary";
            iconBg = "bg-primary/10";
          }

          return (
            <Card key={notif.id} className={`glass-card border-none shadow-sm transition-all ${isUnread ? 'border-l-4 border-l-primary' : 'opacity-70'}`}>
              <CardContent className="p-4 flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-semibold text-lg ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
