"use client";

import { useEffect, useRef, useState } from "react";

import * as Tone from "tone";
import { Chord } from "tonal";

export default function Home() {
  const [isLoaded, setLoaded] = useState(false);
  const [delay, setDelay] = useState(0.04);
  const [forms, setForms] = useState<string[]>(["M", "maj7", "7", "m7", "9"]);
  const [tonics, setTonics] = useState<string[]>([
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
  ]);
  const sampler = useRef<Tone.Sampler | null>(null);
  const [tonic, setTonic] = useState("");
  const [form, setForm] = useState("");

  const playChord = () => {
    Tone.loaded().then(() => {
      if (sampler.current) {
        Tone.start();
        const chord = tonic + form;
        const notes = Chord.notes(chord, `${tonic}3`);
        const now = Tone.now();
        notes.map((note, index) => {
          if (note && sampler.current) {
            sampler.current.triggerAttack(note, now + delay * index);
          }
        });
        sampler.current.triggerRelease(notes, now + (delay * notes.length + 2));
      }
    });
  };

  const playNote = (note: string) => {
    if (sampler.current) {
      sampler.current.triggerAttackRelease(note, 2);
    }
  };

  const setRandomChord = () => {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
          <a
            target="_blank"
            href={`https://jguitar.com/chordsearch/${tonic}${form}`}
          >
            See chord diagrams for {tonic + form}
          </a>
        </details>
        <details>
          <summary>Settings</summary>
          <div>
            <label htmlFor="delay">Strum delay: </label>
            <input
              type="number"
              id="delay"
              value={delay}
              onChange={(e) => {
                setDelay(Number(e.target.value));
              }}
            />
          </div>
          <div>
            <label htmlFor="tonics">Tonics: </label>
            <select
              value={tonics}
              name="tonics"
              id="tonics"
              multiple
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions);
                setTonics(selectedOptions.map((option) => option.value));
              }}
            >
              {/* TODO generate this list automatically */}
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div>
            <label htmlFor="forms">Forms: </label>
            <select
              value={forms}
              name="forms"
              id="forms"
              multiple
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions);
                setForms(selectedOptions.map((option) => option.value));
              }}
            >
              {/* TODO generate this list automatically */}
              <option value="M">M</option>
              <option value="maj7">maj7</option>
              <option value="7">7</option>
              <option value="m7">m7</option>
              <option value="9">9</option>
            </select>
          </div>
        </details>
      </main>
    </div>
  );
}
