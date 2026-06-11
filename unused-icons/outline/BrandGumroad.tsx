import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGumroad = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0" />
    <Path d="M13.5 13h2.5v3" />
    <Path d="M15.024 9.382a4 4 0 1 0 -3.024 6.618c1.862 0 2.554 -1.278 3 -3" />
  </Svg>
);
export default SvgBrandGumroad;
