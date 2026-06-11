import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandValorant = (props: SvgProps) => (
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
    <Path d="M14.5 14h4.5l2 -2v-6l-6.5 8" />
    <Path d="M9 19h5l-11 -13v6l6 7" />
  </Svg>
);
export default SvgBrandValorant;
