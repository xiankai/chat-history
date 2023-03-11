import { html } from "./About.md";

export const About = () => (
  <div className="about">
    <h1>This is the about page</h1>
    <div dangerouslySetInnerHTML={{ __html: html }} />
  </div>
);
