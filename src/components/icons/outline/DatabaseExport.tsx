import type { SvgProps } from "react-native-svg"
import Svg, { Path } from "react-native-svg"

const SvgDatabaseExport = (props: SvgProps) => (
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
    <Path d="M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s-3.582 -3 -8 -3s-8 1.343 -8 3" />
    <Path d="M4 6v6c0 1.657 3.582 3 8 3c1.118 0 2.183 -.086 3.15 -.241" />
    <Path d="M20 12v-6" />
    <Path d="M4 12v6c0 1.657 3.582 3 8 3c.157 0 .312 -.002 .466 -.005" />
    <Path d="M16 19h6" />
    <Path d="M19 16l3 3l-3 3" />
  </Svg>
)
export default SvgDatabaseExport
