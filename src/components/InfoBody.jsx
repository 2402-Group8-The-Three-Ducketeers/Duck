import React, { useState } from 'react';

const InfoBody = () => {
    const [showLore, setShowLore] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showCredits, setShowCredits] = useState(false);

  return (
    <>
    <div className="container1">
            <section className="info-section">
                <h1>Story</h1>
                <h2>Find out the lore of this game. Learn about the extensive lore of the game's characters and understand the entire development of the adventure.</h2>
                <button onClick={() => setShowLore(!showLore)}>Lore</button>
                {showLore && (
                    <div className="lore-content">
                        <h1>Duck Dash</h1>
      <h3>In the heart of the sprawling Wetlands, where reeds sway and lily pads float, a brave and determined duck named Puddle flapped his wings with purpose. His brother, Waddles, had been snatched away by the notorious Eagle Cartel—an avian underworld that ruled the skies with iron talons.</h3>
      <h2>Chapter 1: The Fateful Feathers</h2>
      <h3>Puddle, fueled by sibling love and a dash of righteous anger, embarked on a perilous journey. His webbed feet splashed through murky waters as he followed the trail of feathers left by Waddles. The cartel’s shadow loomed large, and danger lurked behind every cattail.</h3>
      <h2>Chapter 2: The Sky Pirates’ Aerie</h2>
      <h3>The cartel’s reach extended beyond the marshes. Puddle soared higher, his feathers catching the wind. The Sky Pirates—masked crows with cutlasses—patrolled the skies. Their leader, Captain Talon, perched atop a storm cloud, taunting Puddle.</h3>
      <h2>Chapter 3: The Feathered Underworld</h2>
      <h3>Beneath the tangled roots of the Great Willow, Puddle infiltrated the cartel’s secret lair. Here, the underworld thrived—a bustling black market where feathered criminals traded in rare eggs, shiny baubles, and forbidden knowledge.</h3>
      <h2>Chapter 4: The Final Confrontation</h2>
      <h3>At the edge of the world, where clouds met ocean, Puddle faced the ultimate adversary: General Honk, the colossal goose who ruled the cartel. Honk’s beak was sharp, his feathers oiled with menace. Waddles was imprisoned in a golden cage, his eyes pleading for rescue.</h3>
      <h3>And so, dear player, Puddle’s quest ended not only in the rescue of his brother but also in the dismantling of the Eagle Cartel. The skies were safer, and the Wetlands echoed with tales of a duck who dared to defy the odds.

Remember, in the world of feathers and flight, courage knows no bounds. 🦆✨</h3>
                    </div>
                )}
            </section>

            <section className="tutorial-section">
                <h1>Tutorial</h1>
                <h2>Learn the controls of the game. Know your game's goals and how to reach them.</h2>
                <button onClick={() => setShowTutorial(!showTutorial)}>How to Play</button>
                {showTutorial && (
                    <div className="tutorial-content">
                        <h1>How to Play</h1>
        <h2>Movement</h2>
        <h3>Use the arrows in your keyboard to move to your desired direction.</h3>
        <h3>Use the space key to jump, use the arrow to direct your jump</h3>
        <h3>Press two times the space jey to double jump and reach higher places</h3>
        <h2>Enemies</h2>
        <h3>Everthing is your enemy here</h3>
        <h3>Dont touch any of the things and items that are not blocks or cubes</h3>
        <h2>Goals</h2>
        <h3>You main goal is to get the most points posible in the level</h3>
        <h3>To get point you have to:</h3>
        <ul>
          <li>Kill enemies</li>
          <li>Complete the level</li>
          <li>Get special items</li>
          <li>Find collectibles</li>
        </ul>
                    </div>
                )}
            </section>

            <section className="credits-section">
                <h1>Credits</h1>
                <h2>Meet the masterminds behind this work of art.</h2>
                <button onClick={() => setShowCredits(!showCredits)}>Creators</button>
                {showCredits && (
                    <div className="creators-content">
                        <h1>Credits</h1>
      <h2>Game Developed and Published By CodeFowl Studios</h2>
      <h3>Developers:</h3>
      <ul>
        <li>Harris</li>
        <li>Phuc Dang</li>
        <li>Carlos Perez</li>
      </ul>
                    </div>
                )}
            </section>
        </div>
    </>
  )
}

export default InfoBody