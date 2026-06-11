import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWhirl = (props: SvgProps) => (
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
    <Path d="M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
    <Path d="M12 21c-3.314 0 -6 -2.462 -6 -5.5s2.686 -5.5 6 -5.5" />
    <Path d="M21 12c0 3.314 -2.462 6 -5.5 6s-5.5 -2.686 -5.5 -6" />
    <Path d="M12 14c3.314 0 6 -2.462 6 -5.5s-2.686 -5.5 -6 -5.5" />
    <Path d="M14 12c0 -3.314 -2.462 -6 -5.5 -6s-5.5 2.686 -5.5 6" />
  </Svg>
);
export default SvgWhirl;
