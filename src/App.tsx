import {
  Tldraw,
  DefaultToolbar,
  DefaultToolbarContent,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  type TLUiAssetUrlOverrides,
} from 'tldraw'
import type { TLComponents, TLUiOverrides } from 'tldraw'
import 'tldraw/tldraw.css'
import { KatexTool } from './KatexTool'
import { KatexShapeUtil } from './KatexShapeUtil'

const customShapeUtils = [KatexShapeUtil]
const customTools = [KatexTool]


const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Add the katex tool to the ui's context
    tools.katex = {
      id: 'katex',
      icon: 'equation-icon',
      label: 'Math',
      kbd: 'm',
      onSelect: () => {
        editor.setCurrentTool('katex')
      },
    }
    return tools
  },
}

// Asset URLs for custom icons
const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    'equation-icon': '/equation-icon.svg',
  },
}

// Components to customize the toolbar and keyboard shortcuts
const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools()
    const isKatexSelected = useIsToolSelected(tools['katex'])
    return (
      <DefaultToolbar {...props}>
        <TldrawUiMenuItem {...tools['katex']} isSelected={isKatexSelected} />
        <DefaultToolbarContent />
      </DefaultToolbar>
    )
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools()
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools['katex']} />
      </DefaultKeyboardShortcutsDialog>
    )
  },
}

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw
        shapeUtils={customShapeUtils}
        tools={customTools}
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
      />
    </div>
  )
}

export default App
