import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSalt = (props: SvgProps) => (
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
    <Path d="M12 13v.01" />
    <Path d="M10 16v.01" />
    <Path d="M14 16v.01" />
    <Path d="M7.5 8h9l-.281 -2.248a2 2 0 0 0 -1.985 -1.752h-4.468a2 2 0 0 0 -1.986 1.752l-.28 2.248" />
    <Path d="M7.5 8l-1.612 9.671a2 2 0 0 0 1.973 2.329h8.278a2 2 0 0 0 1.973 -2.329l-1.612 -9.671" />
  </Svg>
);
export default SvgSalt;
