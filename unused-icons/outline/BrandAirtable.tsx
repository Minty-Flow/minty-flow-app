import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAirtable = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M3 10v8l7 -3v-2.6l-7 -2.4" />
    <Path d="M3 6l9 3l9 -3l-9 -3l-9 3" />
    <Path d="M14 12.3v8.7l7 -3v-8l-7 2.3" />
  </Svg>
);
export default SvgBrandAirtable;
