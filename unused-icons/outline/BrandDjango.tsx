import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDjango = (props: SvgProps) => (
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
    <Path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12" />
    <Path d="M12 7v8.5l-2.015 .201a2.715 2.715 0 1 1 0 -5.402l2.015 .201" />
    <Path d="M16 7v.01" />
    <Path d="M16 10v5.586c0 .905 -.36 1.774 -1 2.414" />
  </Svg>
);
export default SvgBrandDjango;
