import {
  TextIcon,
  TextBlockIcon,
  HashtagIcon,
  PhoneIcon,
  EmailIcon,
  HideIcon,
  CalendarIcon,
  AttachmentIcon,
  ColorIcon,
  ToggleOnIcon,
  MenuHorizontalIcon,
  SelectIcon,
  StatusActiveIcon,
  CheckboxIcon,
  ButtonIcon,
  ImageIcon,
  TextFontIcon,
  LinkIcon,
  TextTitleIcon,
  MinusIcon,
  ViewportTallIcon,
  TextQuoteIcon,
  CodeIcon,
  LayoutPopupIcon,
  MeasurementSizeIcon,
  FolderIcon,
} from "@shopify/polaris-icons";
export const defaultInputTypes = [
  { content: "Text", icon: TextIcon, disabled: false, type: "text" },
  {
    content: "Textarea",
    icon: TextBlockIcon,
    disabled: false,
    type: "textarea",
  },
  { content: "Number", icon: HashtagIcon, disabled: false, type: "number" },
  { content: "Phone", icon: PhoneIcon, disabled: true, type: "tel" },
  { content: "Email", icon: EmailIcon, disabled: true, type: "email" },
  { content: "Hidden Field", icon: HideIcon, disabled: true, type: "hidden" },
  {
    content: "Datetime",
    icon: CalendarIcon,
    disabled: true,
    type: "datetime-local",
  },
  {
    content: "File Upload",
    icon: AttachmentIcon,
    disabled: true,
    type: "file",
  },
  { content: "Color Picker", icon: ColorIcon, disabled: true, type: "color" },
  { content: "Switch", icon: ToggleOnIcon, disabled: true, type: "checkbox" },
  {
    content: "Range Slider",
    icon: MenuHorizontalIcon,
    disabled: true,
    type: "range",
  },
];

export const defaultSelectionTypes = [
  { content: "Select", icon: SelectIcon, disabled: false, type: "select" },
  { content: "Dropdown", icon: SelectIcon, disabled: false, type: "dropdown" },
  {
    content: "Color Dropdown",
    icon: SelectIcon,
    disabled: true,
    type: "color-dropdown",
  },
  {
    content: "Image Dropdown",
    icon: SelectIcon,
    disabled: true,
    type: "image-dropdown",
  },
  {
    content: "Radio Button",
    icon: StatusActiveIcon,
    disabled: false,
    type: "radio",
  },
  {
    content: "Checkbox",
    icon: CheckboxIcon,
    disabled: false,
    type: "checkbox",
  },
  { content: "Button", icon: ButtonIcon, disabled: false, type: "button" },
  {
    content: "Color Swatch",
    icon: ColorIcon,
    disabled: false,
    type: "color-swatch",
  },
  {
    content: "Image Swatch",
    icon: ImageIcon,
    disabled: false,
    type: "image-swatch",
  },
  {
    content: "Font Picker",
    icon: TextFontIcon,
    disabled: true,
    type: "font-picker",
  },
  {
    content: "Product Links",
    icon: LinkIcon,
    disabled: true,
    type: "product-links",
  },
];

export const defaultStaticTypes = [
  { content: "Heading", icon: TextTitleIcon, disabled: false, type: "heading" },
  { content: "Divider", icon: MinusIcon, disabled: false, type: "divider" },
  {
    content: "Spacing",
    icon: ViewportTallIcon,
    disabled: false,
    type: "spacing",
  },
  {
    content: "Paragraph",
    icon: TextQuoteIcon,
    disabled: false,
    type: "paragraph",
  },
  { content: "HTML", icon: CodeIcon, disabled: true, type: "html" },
  {
    content: "Pop-up Modal",
    icon: LayoutPopupIcon,
    disabled: true,
    type: "pop-up-modal",
  },
  {
    content: "Size chart",
    icon: MeasurementSizeIcon,
    disabled: true,
    type: "size-chart",
  },
  { content: "Tabs", icon: FolderIcon, disabled: true, type: "tabs" },
];

export const elementTypes = [
  ...defaultInputTypes,
  ...defaultSelectionTypes,
  ...defaultStaticTypes,
];

export const findElementIcon = (type) => {
  return elementTypes.find((el) => el.type === type).icon || null;
};

export const findElementName = (type) => {
  return elementTypes.find((el) => el.type === type).content || null;
};
