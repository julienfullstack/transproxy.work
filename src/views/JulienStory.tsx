import { BioFrame } from '../components/BioFrame'
import { juliensStory } from '../content/juliensStory'

export function JulienStory() {
  return <article className="page story story-page">
    <header className="story-intro bio-pane"><BioFrame compact />
      <p className="status-label">{juliensStory.author} · Founder</p>
      <h2>{juliensStory.title}</h2>
      <p className="story-summary">{juliensStory.summary}</p>
    </header>
    <div className="story-layout">
      <aside className="story-index bio-pane" aria-label="Story contents"><BioFrame compact />
        <h3>In this story</h3>
        <ol>{juliensStory.sections.map(section => <li key={section.id}><button type="button" onClick={() => document.getElementById(`story-${section.id}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{section.heading}</button></li>)}</ol>
      </aside>
      <div className="story-article bio-pane"><BioFrame compact />
        {juliensStory.sections.map(section => <section id={`story-${section.id}`} key={section.id}>
          <h3>{section.heading}</h3>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
        <p className="story-source"><a href="https://cruush.app/cruise-control/i-said-no-before-surgery.html">Read my earlier published account ›</a></p>
        <a className="glass-link" href="#waitlist">Join the TransProxy waiting list ›</a>
      </div>
    </div>
  </article>
}
