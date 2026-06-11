import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCarCrash = (props: SvgProps) => (
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
    <Path d="M8 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M7 6l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-5m0 -6h8m-6 0v-5m2 0h-4" />
    <Path d="M14 8v-2" />
    <Path d="M19 12h2" />
    <Path d="M17.5 15.5l1.5 1.5" />
    <Path d="M17.5 8.5l1.5 -1.5" />
  </Svg>
);
export default SvgCarCrash;
