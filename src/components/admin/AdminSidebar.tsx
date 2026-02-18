import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Newspaper, Quote, Image, FolderOpen,
  Settings, LogOut, MessageSquare, X, Briefcase, Camera, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/news", icon: Newspaper, label: "Manage News" },
  { to: "/admin/quotes", icon: Quote, label: "Manage Quotes" },
  { to: "/admin/ads", icon: Image, label: "Advertisements" },
  { to: "/admin/categories", icon: FolderOpen, label: "Categories" },
  { to: "/admin/jobs", icon: Briefcase, label: "Manage Jobs" },
  { to: "/admin/gallery", icon: Camera, label: "Manage Gallery" },
  { to: "/admin/feedback", icon: MessageSquare, label: "Feedback" },
  { to: "/admin/submissions", icon: FileText, label: "Submissions" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ open, onClose }: Props) => {
  const { signOut } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-primary">ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್</h2>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
