import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// I suck at naming
const TemplateCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const truncateText = (text: string, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-muted-foreground">{truncateText(content)}</p>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Link to={`/template/${index}`}>Edit</Link>
                    </Button>
                    <Button size="sm">
                      <Link to={`/preview/${index}`}>Preview</Link>
                    </Button>
                  </CardFooter> */}
    </Card>
  );
};

export default TemplateCard;
