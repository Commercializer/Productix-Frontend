interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
  blue: "stats-card--blue",
  green: "stats-card--green",
  purple: "stats-card--purple",
  orange: "stats-card--orange",
};

export function StatsCard({ label, value, icon, trend, color = "blue" }: StatsCardProps) {
  return (
    <div className={`stats-card ${colorMap[color]}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-body">
        <p className="stats-card-value">{value.toLocaleString()}</p>
        <p className="stats-card-label">{label}</p>
        {trend && <p className="stats-card-trend">{trend}</p>}
      </div>
    </div>
  );
}
