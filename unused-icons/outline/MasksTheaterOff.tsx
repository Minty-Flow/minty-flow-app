import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMasksTheaterOff = (props: SvgProps) => (
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
    <Path d="M13 9c.058 0 .133 0 .192 0h6.616a2 2 0 0 1 1.992 2.183l-.554 6.041m-1.286 2.718a3.99 3.99 0 0 1 -2.71 1.058h-1.5a4 4 0 0 1 -3.983 -3.635l-.567 -6.182" />
    <Path d="M18 13h.01" />
    <Path d="M15 16.5c.657 .438 1.313 .588 1.97 .451" />
    <Path d="M8.632 15.982a4.05 4.05 0 0 1 -.382 .018h-1.5a4 4 0 0 1 -3.983 -3.635l-.567 -6.182a2 2 0 0 1 .514 -1.531a1.99 1.99 0 0 1 1.286 -.652m4 0h2.808a2 2 0 0 1 2 2" />
    <Path d="M6 8h.01" />
    <Path d="M6 12c.764 -.51 1.528 -.63 2.291 -.36" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgMasksTheaterOff;
