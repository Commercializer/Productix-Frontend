import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@productix/ui";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          A brief description of what this card represents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the main content area of the card. It can contain any content
          you need.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A minimal card with just a title and content.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Stats: Story = {
  render: () => (
    <div className="flex gap-4">
      {[
        { label: "Total Pages", value: "2,847", change: "+12%" },
        { label: "Active Users", value: "1,234", change: "+8%" },
        { label: "Published", value: "892", change: "+24%" },
      ].map((stat) => (
        <Card key={stat.label} className="w-[200px]">
          <CardHeader className="pb-2">
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-3xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-medium text-emerald-600">
              {stat.change} from last month
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
