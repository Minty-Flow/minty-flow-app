import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandAlpineJs = (props: SvgProps) => (
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
    <Path d="M3 11.5l4.5 4.5h9l-9 -9l-4.5 4.5" />
    <Path d="M16.5 16l4.5 -4.5l-4.5 -4.5l-4.5 4.5" />
  </Svg>
);
export default SvgBrandAlpineJs;
