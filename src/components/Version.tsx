import packageInfo from "package.json";
export function AppVersion() {
  return (
    <div className="text-center text-xs opacity-50">
      version: {packageInfo.version}
    </div>
  );
}
