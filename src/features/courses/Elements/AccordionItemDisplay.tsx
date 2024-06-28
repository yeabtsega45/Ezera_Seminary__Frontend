import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionItemProps {
  title: string;
  content: string;
  onToggle: (value: string) => void; // Expect a callback function for Next button
}

const AccordionItemDisplay: React.FC<AccordionItemProps> = ({
  title,
  content,
  onToggle,
}) => {
  return (
    <Accordion type="single" collapsible onValueChange={onToggle}>
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionItemDisplay;
