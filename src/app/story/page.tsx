import { FlicAppScrollytelling } from "@/components/storytelling";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export default function StoryPage() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ToggleTheme />
      </div>
      <FlicAppScrollytelling />
    </>
  );
}
