import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRelationOneToMany = (props: SvgProps) => (
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
    <Path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
    <Path d="M7 10h1v4" />
    <Path d="M14 14v-4l3 4v-4" />
    <Path d="M11 10.5l0 .01" />
    <Path d="M11 13.5l0 .01" />
  </Svg>
);
export default SvgRelationOneToMany;
