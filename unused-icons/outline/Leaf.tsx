import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLeaf = (props: SvgProps) => (
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
    <Path d="M5 21c.5 -4.5 2.5 -8 7 -10" />
    <Path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014c-9 0 -11.986 4 -12 9c0 1 0 3 2 5h3l.014 0" />
  </Svg>
);
export default SvgLeaf;
