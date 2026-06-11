import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNetworkOff = (props: SvgProps) => (
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
    <Path d="M6.528 6.536a6 6 0 0 0 7.942 7.933m2.247 -1.76a6 6 0 0 0 -8.427 -8.425" />
    <Path d="M12 3c1.333 .333 2 2.333 2 6c0 .337 -.006 .66 -.017 .968m-.55 3.473c-.333 .884 -.81 1.403 -1.433 1.559" />
    <Path d="M12 3c-.936 .234 -1.544 1.29 -1.822 3.167m-.16 3.838c.116 3.029 .776 4.695 1.982 4.995" />
    <Path d="M6 9h3m4 0h5" />
    <Path d="M3 20h7" />
    <Path d="M14 20h7" />
    <Path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M12 15v3" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgNetworkOff;
