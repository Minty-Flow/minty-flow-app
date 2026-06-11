import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandVisa = (props: SvgProps) => (
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
    <Path d="M21 15l-1 -6l-2.5 6" />
    <Path d="M9 15l1 -6" />
    <Path d="M3 9h1v6h.5l2.5 -6" />
    <Path d="M16 9.5a.5 .5 0 0 0 -.5 -.5h-.75c-.721 0 -1.337 .521 -1.455 1.233l-.09 .534a1.059 1.059 0 0 0 1.045 1.233a1.059 1.059 0 0 1 1.045 1.233l-.09 .534a1.476 1.476 0 0 1 -1.455 1.233h-.75a.5 .5 0 0 1 -.5 -.5" />
    <Path d="M18 14h2.7" />
  </Svg>
);
export default SvgBrandVisa;
