import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDeviceLandlinePhone = (props: SvgProps) => (
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
    <Path d="M20 3h-2a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2" />
    <Path d="M16 4h-11a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h11" />
    <Path d="M12 8h-6v3h6l0 -3" />
    <Path d="M12 14v.01" />
    <Path d="M9 14v.01" />
    <Path d="M6 14v.01" />
    <Path d="M12 17v.01" />
    <Path d="M9 17v.01" />
    <Path d="M6 17v.01" />
  </Svg>
);
export default SvgDeviceLandlinePhone;
