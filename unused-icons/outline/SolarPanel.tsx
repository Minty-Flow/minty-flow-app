import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSolarPanel = (props: SvgProps) => (
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
    <Path d="M4.28 14h15.44a1 1 0 0 0 .97 -1.243l-1.5 -6a1 1 0 0 0 -.97 -.757h-12.44a1 1 0 0 0 -.97 .757l-1.5 6a1 1 0 0 0 .97 1.243" />
    <Path d="M4 10h16" />
    <Path d="M10 6l-1 8" />
    <Path d="M14 6l1 8" />
    <Path d="M12 14v4" />
    <Path d="M7 18h10" />
  </Svg>
);
export default SvgSolarPanel;
