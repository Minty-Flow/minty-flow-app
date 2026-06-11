import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPackageImport = (props: SvgProps) => (
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
    <Path d="M12 21l-8 -4.5v-9l8 -4.5l8 4.5v4.5" />
    <Path d="M12 12l8 -4.5" />
    <Path d="M12 12v9" />
    <Path d="M12 12l-8 -4.5" />
    <Path d="M22 18h-7" />
    <Path d="M18 15l-3 3l3 3" />
  </Svg>
);
export default SvgPackageImport;
