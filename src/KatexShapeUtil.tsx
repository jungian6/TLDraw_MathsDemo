import {
	Geometry2d,
	HTMLContainer,
	Rectangle2d,
	T,
	ShapeUtil,
	stopEventPropagation,
} from 'tldraw'
import type { RecordProps, TLBaseShape } from 'tldraw'

import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill'
import type { MathField } from 'react-mathquill'

// Inserts the required css to the <head> block.
// You can skip this, if you want to do that by yourself.
try {
	addStyles()
} catch {
	// Can fail in SSR, we don't care.
}

// LaTeX suggestions for the suggestions overlay
const LATEX_SUGGESTIONS = [
	{ label: '𝑓(𝑥)', latex: '\\frac{}{}'  },
	{ label: '√', latex: '\\sqrt{}' },
	{ label: '𝑥²', latex: '^{}' },
	{ label: '𝑥₁', latex: '_{}' },
	{ label: '∫', latex: '\\int_{}^{}' },
	{ label: '∑', latex: '\\sum_{}^{}' },
	{ label: 'α', latex: '\\alpha' },
	{ label: 'β', latex: '\\beta' },
	{ label: 'θ', latex: '\\theta' },
	{ label: '≤', latex: '\\leq' },
	{ label: '≥', latex: '\\geq' },
	{ label: '∞', latex: '\\infty' },
]

// Define the shape type
type IMyKatexShape = TLBaseShape<
	'katex-shape',
	{
		w: number // width of the shape
		h: number // height of the shape
		text: string // LaTeX code for the shape
	}
>

// Define the shape util for the katex shape
export class KatexShapeUtil extends ShapeUtil<IMyKatexShape> {
	static override type = 'katex-shape' as const
	static override props: RecordProps<IMyKatexShape> = {
		w: T.number,
		h: T.number,
		text: T.string
	}

	// Allow the shape to be edited but not resized as thats not currently supported
	// An alternative would be to increase the font size of the math field to make it larger?
	override canEdit = () => true
	override canResize = () => false
	override isAspectRatioLocked = () => false

	// Get the geometry of the math field as a rectangle
	getGeometry(shape: IMyKatexShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	// Get the default props for the shape
	getDefaultProps(): IMyKatexShape['props'] {
		return {
			w: 200,
			h: 60,
			text: '\\sin^2\\theta+\\cos^2\\theta=1',
		}
	}

	// Store mathField reference as instance property
	private mathFieldRef: MathField | null = null

	// Render the shape as an editable or static math field
	component(shape: IMyKatexShape) {
		const isEditing = this.editor.getEditingShapeId() === shape.id

		const handleMathFieldChange = (mathField: MathField) => {
			if (!mathField) return
			// Store reference for later use
			this.mathFieldRef = mathField
			
			const element = mathField.el() as HTMLElement
			const newWidth = Math.max(element.offsetWidth, 50)
			const newHeight = Math.max(element.offsetHeight, 40)
			const newText = mathField.latex()

			this.editor.updateShape({
				id: shape.id,
				type: shape.type,
				props: {
					...shape.props,
					text: newText,
					w: newWidth,
					h: newHeight,
				},
			})
		}

		// Insert LaTeX code into the math field
		const insertLatex = (latex: string) => {
			if (this.mathFieldRef) {
				this.mathFieldRef.write(latex)
				this.mathFieldRef.focus()
			}
		}

		// If the shape is being edited, return the editable math field
		if (isEditing) {
			return (
				<HTMLContainer
					id={shape.id}
					onPointerDown={stopEventPropagation}
					style={{
						pointerEvents: 'all',
						width: `${shape.props.w}px`,
						height: `${shape.props.h}px`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
				>
					<EditableMathField
						latex={shape.props.text}
						onChange={handleMathFieldChange}
						style={{
							boxSizing: 'border-box',
							backgroundColor: 'rgb(255, 255, 255)',
							padding: '10px 15px',
							fontSize: '16px',
							borderRadius: '4px',
							textAlign: 'center',
							border: '2px solid #0096ff',
						}}
					/>
					
					{/* Suggestions overlay */}
					<div
						style={{
							position: 'absolute',
							top: '100%',
							left: '50%',
							transform: 'translateX(-50%)',
							marginTop: '8px',
							backgroundColor: 'white',
							border: '1px solid #ccc',
							borderRadius: '8px',
							padding: '8px',
							display: 'grid',
							gridTemplateColumns: 'repeat(6, 1fr)',
							gap: '4px',
							boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
							zIndex: 1000,
							minWidth: '240px',
						}}
					>
						{LATEX_SUGGESTIONS.map((suggestion, index) => (
							<button
								key={index}
								onClick={(e) => {
									e.stopPropagation()
									insertLatex(suggestion.latex)
								}}
								style={{
									border: '1px solid #ddd',
									borderRadius: '4px',
									padding: '6px 8px',
									backgroundColor: 'white',
									cursor: 'pointer',
									fontSize: '14px',
									minWidth: '32px',
									height: '32px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.2s',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#f0f0f0'
									e.currentTarget.style.borderColor = '#0096ff'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'white'
									e.currentTarget.style.borderColor = '#ddd'
								}}
								title={`Insert ${suggestion.latex}`}
							>
								{suggestion.label}
							</button>
						))}
					</div>
				</HTMLContainer>
			)
		}

		// If the shape is not being edited, return the static math field
		return (
			<HTMLContainer
				id={shape.id}
				style={{
					pointerEvents: 'none',
					width: `${shape.props.w}px`,
					height: `${shape.props.h}px`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<StaticMathField
					style={{
						boxSizing: 'border-box',
						backgroundColor: 'rgba(255, 255, 255, 0.9)',
						padding: '10px 15px',
						fontSize: '16px',
						borderRadius: '4px',
						textAlign: 'center',
						border: '1px solid #ddd',
					}}
				>
					{shape.props.text}
				</StaticMathField>
			</HTMLContainer>
		)
	}

	// Fit the blue TLDraw outline to the math field when the shape is selected
	indicator(shape: IMyKatexShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
} 