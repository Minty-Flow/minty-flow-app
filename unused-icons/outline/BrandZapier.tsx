import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandZapier = (props: SvgProps) => (
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
    <Path d="M3 12h6" />
    <Path d="M21 12h-6" />
    <Path d="M12 3v6" />
    <Path d="M12 15v6" />
    <Path d="M5.636 5.636l4.243 4.243" />
    <Path d="M18.364 18.364l-4.243 -4.243" />
    <Path d="M18.364 5.636l-4.243 4.243" />
    <Path d="M9.879 14.121l-4.243 4.243" />
  </Svg>
);
export default SvgBrandZapier;
