import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandThreejs = (props: SvgProps) => (
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
    <Path d="M8 22l-5 -19l19 5.5l-14 13.5" />
    <Path d="M12.573 17.58l-6.152 -1.576l8.796 -9.466l1.914 6.64" />
    <Path d="M12.573 17.58l-1.573 -6.58l6.13 2.179" />
    <Path d="M9.527 4.893l1.473 6.107l-6.31 -1.564l4.837 -4.543" />
  </Svg>
);
export default SvgBrandThreejs;
