import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeRibbon = (props: SvgProps) => (
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
    <Path d="M16 15h5v7l-2.5 -1.5l-2.5 1.5l0 -7" />
    <Path d="M20 11l-8 -8l-9 9h2v7a2 2 0 0 0 2 2h5" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h1.5" />
  </Svg>
);
export default SvgHomeRibbon;
