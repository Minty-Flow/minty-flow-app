import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSolarElectricity = (props: SvgProps) => (
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
    <Path d="M4 6.28v11.44a1 1 0 0 0 1.243 .97l6 -1.5a1 1 0 0 0 .757 -.97v-8.44a1 1 0 0 0 -.757 -.97l-6 -1.5a1 1 0 0 0 -1.243 .97" />
    <Path d="M8 6v12" />
    <Path d="M12 12h-8" />
    <Path d="M20 7l-3 5h4l-3 5" />
  </Svg>
);
export default SvgSolarElectricity;
