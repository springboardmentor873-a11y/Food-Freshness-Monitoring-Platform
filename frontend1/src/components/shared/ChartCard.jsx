import Card from "../ui/Card";

/**
 * ChartCard — consistent Card wrapper for every chart in the app
 * (title/subtitle/action header + chart body), so Dashboard and
 * Analytics charts share identical spacing and framing.
 */
export default function ChartCard({ title, subtitle, action, children, className }) {
  return (
    <Card className={className}>
      <Card.Header title={title} subtitle={subtitle} action={action} />
      {children}
    </Card>
  );
}
