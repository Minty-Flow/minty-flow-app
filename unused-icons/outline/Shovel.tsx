import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShovel = (props: SvgProps) => (
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
    <Path d="M17 4l3 3" />
    <Path d="M18.5 5.5l-8 8" />
    <Path d="M8.276 11.284l4.44 4.44a.968 .968 0 0 1 0 1.369l-2.704 2.704a4.108 4.108 0 0 1 -5.809 -5.81l2.704 -2.703a.968 .968 0 0 1 1.37 0l-.001 0" />
  </Svg>
);
export default SvgShovel;
