#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

// Game Variables
const enemies: string[] = ["Skeleton", "Zombie", "Warrior", "Assassin"];
const maxEnemyHealth: number = 75;
const enemyAttackDamage: number = 25;

// Player Variables
let health: number = 100;
const attackDamage: number = 50;
let numHealthPotions: number = 3;
const healthPotionHealAmount: number = 30;
const healthPotionDropChance: number = 30; // Percentage

let running: boolean = true;

const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Welcome Message
console.log(chalk.yellowBright("\n\tWelcome To The Dungeon!\n"));

async function gameLoop() {
    // Main game loop
    while (running && health > 0) {
        // Enemy Encounter Prompt
        console.log(chalk.cyanBright("\nChoose an enemy to encounter:"));

        const enemyChoice = await inquirer.prompt({
            name: "enemy",
            type: "list",
            message: "Select an enemy:",
            choices: enemies.map(enemy => chalk.redBright(enemy)),
        });

        const enemy: string = chalk.redBright(enemyChoice.enemy);

        // Enemy Appearance Message
        console.log(chalk.cyanBright(`\n\tA ${enemy} has appeared!\n`));

        let enemyHealth: number = getRandomNumber(1, maxEnemyHealth);

        while (enemyHealth > 0 && health > 0) {
            // Player Health Display
            console.log(chalk.greenBright(`\tYour HP: ${health}`));
            // Enemy Health Display
            console.log(chalk.redBright(`\t${enemy} HP: ${enemyHealth}\n`));

            const control = await inquirer.prompt({
                name: "command",
                type: "list",
                message: "What would you like to do?",
                choices: ["Attack", "Drink Health Potion", "Run"],
            });

            switch (control.command) {
                case "Attack":
                    const strikeDamage: number = getRandomNumber(1, attackDamage);
                    const damageTaken: number = getRandomNumber(1, enemyAttackDamage);

                    health -= damageTaken;
                    enemyHealth -= strikeDamage;

                    // Player Action Prompt
                    console.log(chalk.yellowBright(`\tYou strike the ${enemy} for ${strikeDamage} damage.`));
                    // Damage Taken Message
                    console.log(chalk.redBright(`\tYou receive ${damageTaken} damage from the ${enemy}.\n`));
                    break;

                case "Drink Health Potion":
                    if (numHealthPotions > 0) {
                        const previousHealth = health;
                        health = Math.min(100, health + healthPotionHealAmount);
                        numHealthPotions--;

                        // Health Potion Message
                        console.log(chalk.greenBright(`\tYou drink a health potion, healing yourself for ${health - previousHealth}.`));
                        // Remaining Health Points Message
                        console.log(chalk.greenBright(`\tYou now have ${health} HP.`));
                        // Remaining Health Potions Message
                        console.log(chalk.greenBright(`\tYou have ${numHealthPotions} health potions left.\n`));
                    } else {
                        // No Health Potions Message
                        console.log(chalk.redBright(`\tYou have no health potions left! Defeat enemies for a chance to get one.\n`));
                    }
                    break;

                case "Run":
                    // Run Away Message
                    console.log(chalk.yellowBright(`\tYou ran away from the ${enemy}!\n`));
                    enemyHealth = 0; // Ensure the enemy encounter ends if running away
                    break;
            }
        }

        if (health < 1) {
            // Player Defeated Message
            console.log(chalk.redBright(`\tYou limp out of the dungeon, weak from battle.\n`));
            break;
        }

        // Enemy Defeated Message
        console.log(chalk.cyanBright(`\n\t${enemy} has been defeated!`));
        // Remaining Health Points Message
        console.log(chalk.greenBright(`\tYou have ${health} HP left.\n`));

        if (getRandomNumber(1, 100) <= healthPotionDropChance) {
            numHealthPotions++;
            // Health Potion Drop Message
            console.log(chalk.greenBright(`\tThe ${enemy} dropped a health potion! You now have ${numHealthPotions} health potion(s) left.\n`));
        }

        const stateControl = await inquirer.prompt({
            name: "state",
            type: "list",
            message: "What would you like to do next?",
            choices: ["Continue Fighting", "Exit Dungeon"],
        });

        if (stateControl.state === "Exit Dungeon") {
            // Exit Dungeon Message
            console.log(chalk.cyanBright(`\n\tYou have exited the dungeon. Goodbye!\n`));
            running = false;
        } else {
            // Continue Fighting Message
            console.log(chalk.cyanBright(`\n\tYou continue your adventure!\n`));
        }
    }

    // Game Over Message

    console.log(chalk.yellowBright.bold("\n============================================="));
    console.log(chalk.yellowBright.bold("\n\tTHANK YOU FOR PLAYING\n"));
    console.log(chalk.yellowBright.bold("=============================================\n"));

}

// Start the game loop
gameLoop();