import {
  type ReactNode,
  type DetailedHTMLProps,
  type LabelHTMLAttributes,
} from "react";
import { Section } from "./Section";

export function Label(
  props: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > & { title: string; children: ReactNode }
) {
  const { title, children, ...rest } = props;

  return (
    <Section>
      <label {...rest} className="text-xs">
        {title}
      </label>
      {children}
    </Section>
  );
}
