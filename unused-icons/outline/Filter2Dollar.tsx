import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFilter2Dollar = (props: SvgProps) => (
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
    <Path d="M4 6h16" />
    <Path d="M6 12h10" />
    <Path d="M9 18h4" />
    <Path d="M21 15h-2m-2 6h2m0 0v1m0 -1h.5c.398 0 .779 -.158 1.061 -.439c.281 -.281 .439 -.663 .439 -1.061c0 -.398 -.158 -.779 -.439 -1.061c-.281 -.281 -.663 -.439 -1.061 -.439h-1c-.398 0 -.779 -.158 -1.061 -.439c-.281 -.281 -.439 -.663 -.439 -1.061c0 -.398 .158 -.779 .439 -1.061c.281 -.281 .663 -.439 1.061 -.439h.5m0 -1v1" />
  </Svg>
);
export default SvgFilter2Dollar;
