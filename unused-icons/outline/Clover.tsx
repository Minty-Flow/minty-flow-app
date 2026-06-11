import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClover = (props: SvgProps) => (
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
    <Path d="M12 10l-3.397 -3.44a2.104 2.104 0 0 1 0 -2.95a2.04 2.04 0 0 1 2.912 0l.485 .39l.485 -.39a2.04 2.04 0 0 1 2.912 0a2.104 2.104 0 0 1 0 2.95l-3.397 3.44" />
    <Path d="M12 14l-3.397 3.44a2.104 2.104 0 0 0 0 2.95a2.04 2.04 0 0 0 2.912 0l.485 -.39l.485 .39a2.04 2.04 0 0 0 2.912 0a2.104 2.104 0 0 0 0 -2.95l-3.397 -3.44" />
    <Path d="M14 12l3.44 -3.397a2.104 2.104 0 0 1 2.95 0a2.04 2.04 0 0 1 0 2.912l-.39 .485l.39 .485a2.04 2.04 0 0 1 0 2.912a2.104 2.104 0 0 1 -2.95 0l-3.44 -3.397" />
    <Path d="M10 12l-3.44 -3.397a2.104 2.104 0 0 0 -2.95 0a2.04 2.04 0 0 0 0 2.912l.39 .485l-.39 .485a2.04 2.04 0 0 0 0 2.912a2.104 2.104 0 0 0 2.95 0l3.44 -3.397" />
  </Svg>
);
export default SvgClover;
