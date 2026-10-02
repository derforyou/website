import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthFormSection({
  title,
  description,
  primaryAction,
  secondary,
  children,
}: {
  title: string;
  description: string;
  primaryAction: string;
  secondary?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <Button className="w-full">{primaryAction}</Button>
        {secondary ? <div className="flex items-center justify-between text-sm text-muted-foreground">{secondary}</div> : null}
      </CardContent>
    </Card>
  );
}