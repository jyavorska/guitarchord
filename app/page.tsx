"use client";

import { useEffect, useRef, useState } from "react";

import * as Tone from "tone";
import { Chord } from "tonal";

export default function Home() {
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef<Tone.Sampler | null>(null);
  const [tonic, setTonic] = useState("");
  const [form, setForm] = useState("");

  const playChord = () => {
    Tone.loaded().then(() => {
      if (sampler.current) {
        Tone.start();
        const delay = 0.04;
        const chord = tonic + form;
        const notes = Chord.notes(chord, `${tonic}3`);
        const now = Tone.now();
        notes.map((note, index) => {
          if (note && sampler.current) {
              sampler.current.triggerAttack(note, now + delay * index);
          }
        });
        sampler.current.triggerRelease(notes, now + 2);
      }
    });
  };

  const playNote = (note: string) => {
    if (sampler.current) {
      sampler.current.triggerAttackRelease(note, 2);
    }
  };

  const setRandomChord = () => {
    const tonics = ["C", "D", "E", "F", "G", "A", "B"];
    const forms = ["", "m", "maj7", "7", "m7", "9"];
    setTonic(tonics[Math.floor(Math.random() * tonics.length)]);
    setForm(forms[Math.floor(Math.random() * forms.length)]);
  };

  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls: {
        A3: "A3.mp3",
        A4: "A4.mp3",
        C3: "C3.mp3",
        C4: "C4.mp3",
      },
      release: 1,
      baseUrl: "/samples/acoustic/",
    }).toDestination();
    setRandomChord();
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (tonic !== "" && form !== "") {
      playChord();
    }
  }, [tonic, form]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button disabled={!isLoaded} onClick={playChord}>
          (re)play
        </button>
        <button disabled={!isLoaded} onClick={setRandomChord}>
          randomise
        </button>
        <details>
          <summary>Show/hide tonic</summary>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => playNote(tonic + "3")}>{tonic}</button>
          </div>
        </details>
        <details>
          <summary>Show/hide full answer</summary>
          <button onClick={playChord}>{`${tonic}${form}`}</button>
          <div className="flex flex-wrap gap-2">
            {Chord.notes(tonic + form, `${tonic}3`).map((note, index) => (
              <button key={index} onClick={() => playNote(note)}>
                {note}
              </button>
            ))}
          </div>
          <a target="_blank" href={`https://jguitar.com/chordsearch/${tonic}${form}`}>See chord diagrams for {tonic + form}</a>
        </details>
      </main>
    </div>
  );
}
