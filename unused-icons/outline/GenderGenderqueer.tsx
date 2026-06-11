import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGenderGenderqueer = (props: SvgProps) => (
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
    <Path d="M12 11a5 5 0 1 1 0 10a5 5 0 0 1 0 -10" />
    <Path d="M12 11v-8" />
    <Path d="M14.5 4.5l-5 3" />
    <Path d="M9.5 4.5l5 3" />
  </Svg>
);
export default SvgGenderGenderqueer;
