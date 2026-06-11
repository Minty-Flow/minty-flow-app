import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGoogleDrive = (props: SvgProps) => (
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
    <Path d="M12 10l-6 10l-3 -5l6 -10l3 5" />
    <Path d="M9 15h12l-3 5h-12" />
    <Path d="M15 15l-6 -10h6l6 10l-6 0" />
  </Svg>
);
export default SvgBrandGoogleDrive;
