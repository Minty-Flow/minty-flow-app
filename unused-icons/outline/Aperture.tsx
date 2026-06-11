import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAperture = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M3.6 15h10.55" />
    <Path d="M6.551 4.938l3.26 10.034" />
    <Path d="M17.032 4.636l-8.535 6.201" />
    <Path d="M20.559 14.51l-8.535 -6.201" />
    <Path d="M12.257 20.916l3.261 -10.034" />
  </Svg>
);
export default SvgAperture;
