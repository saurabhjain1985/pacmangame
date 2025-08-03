#!/usr/bin/env node

/**
 * Automated Game Testing Framework
 * Advanced testing with Puppeteer for browser automation
 */

const { Command } = require('commander');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const http = require('http');

class GameTestRunner {
    constructor() {
        this.games = [
            { name: 'Memory Game', file: 'memory.html', key: 'memory' },
            { name: 'Tetris', file: 'tetris.html', key: 'tetris' },
            { name: 'Breakout', file: 'breakout.html', key: 'breakout' },
            { name: 'Snake', file: 'snake.html', key: 'snake' },
            { name: 'Pacman', file: 'pacman.html', key: 'pacman' },
            { name: 'Puzzle Games', file: 'puzzle.html', key: 'puzzle' },
            { name: 'Math Tables', file: 'math-tables.html', key: 'math' }
        ];
        
        this.server = null;
        this.browser = null;
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            total: 0
        };
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        let coloredMessage;
        
        switch(type) {
            case 'success':
                coloredMessage = chalk.green(`✅ [${timestamp}] ${message}`);
                break;
            case 'error':
                coloredMessage = chalk.red(`❌ [${timestamp}] ${message}`);
                break;
            case 'warning':
                coloredMessage = chalk.yellow(`⚠️  [${timestamp}] ${message}`);
                break;
            case 'info':
            default:
                coloredMessage = chalk.blue(`ℹ️  [${timestamp}] ${message}`);
                break;
        }
        
        console.log(coloredMessage);
    }

    async startServer() {
        return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
                const url = require('url').parse(req.url, true);
                const filePath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
                
                try {
                    const content = fs.readFileSync(filePath);
                    let contentType = 'text/plain';
                    
                    if (filePath.endsWith('.html')) contentType = 'text/html';
                    else if (filePath.endsWith('.css')) contentType = 'text/css';
                    else if (filePath.endsWith('.js')) contentType = 'application/javascript';
                    else if (filePath.endsWith('.json')) contentType = 'application/json';
                    
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                } catch (error) {
                    res.writeHead(404);
                    res.end('Not Found');
                }
            });

            this.server.listen(8080, () => {
                this.log('Test server started on http://localhost:8080', 'success');
                resolve();
            });

            this.server.on('error', (error) => {
                this.log(`Server error: ${error.message}`, 'error');
                reject(error);
            });
        });
    }

    async stopServer() {
        if (this.server) {
            this.server.close();
            this.log('Test server stopped', 'info');
        }
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.log('Browser started', 'success');
    }

    async stopBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.log('Browser closed', 'info');
        }
    }

    async runQuickTests() {
        this.log('🚀 Starting quick test suite...', 'info');
        
        try {
            await this.startServer();
            await this.startBrowser();
            
            // Run basic load tests
            for (const game of this.games) {
                await this.testGameLoad(game);
            }
            
            await this.testMainMenu();
            
        } catch (error) {
            this.log(`Quick test failed: ${error.message}`, 'error');
        } finally {
            await this.stopBrowser();
            await this.stopServer();
        }
        
        this.printResults();
    }

    async runFullTests() {
        this.log('🔄 Starting comprehensive test suite...', 'info');
        
        try {
            await this.startServer();
            await this.startBrowser();
            
            // Load tests
            this.log('Running load tests...', 'info');
            for (const game of this.games) {
                await this.testGameLoad(game);
            }
            
            // Functionality tests
            this.log('Running functionality tests...', 'info');
            for (const game of this.games) {
                await this.testGameFunctionality(game);
            }
            
            // Performance tests
            this.log('Running performance tests...', 'info');
            for (const game of this.games) {
                await this.testGamePerformance(game);
            }
            
            // Integration tests
            this.log('Running integration tests...', 'info');
            await this.testMainMenu();
            await this.testNavigation();
            
        } catch (error) {
            this.log(`Full test failed: ${error.message}`, 'error');
        } finally {
            await this.stopBrowser();
            await this.stopServer();
        }
        
        this.printResults();
    }

    async testGameLoad(game) {
        const page = await this.browser.newPage();
        
        try {
            this.log(`Testing ${game.name} load...`, 'info');
            
            // Set viewport for mobile testing
            await page.setViewport({ width: 375, height: 667 });
            
            // Navigate with timeout
            await page.goto(`http://localhost:8080/${game.file}`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            
            // Check for basic elements
            const title = await page.title();
            const hasCanvas = await page.$('canvas') !== null;
            const hasScript = await page.$('script') !== null;
            
            // Check for JavaScript errors
            const errors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });
            
            // Wait a bit for any errors to surface
            await page.waitForTimeout(2000);
            
            if (title && (hasCanvas || hasScript) && errors.length === 0) {
                this.log(`${game.name} loaded successfully`, 'success');
                this.testResults.passed++;
            } else {
                this.log(`${game.name} load issues: ${errors.join(', ')}`, 'warning');
                this.testResults.warnings++;
            }
            
        } catch (error) {
            this.log(`${game.name} failed to load: ${error.message}`, 'error');
            this.testResults.failed++;
        } finally {
            await page.close();
            this.testResults.total++;
        }
    }

    async testGameFunctionality(game) {
        const page = await this.browser.newPage();
        
        try {
            this.log(`Testing ${game.name} functionality...`, 'info');
            
            await page.goto(`http://localhost:8080/${game.file}`, {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            
            // Test if game can start
            const startButton = await page.$('button, .btn, #startBtn, .start-button');
            if (startButton) {
                await startButton.click();
                await page.waitForTimeout(1000);
                this.log(`${game.name} start button functional`, 'success');
            }
            
            // Test mobile controls (touch simulation)
            const mobileControls = await page.$$('.mobile-controls button, .control-btn');
            if (mobileControls.length > 0) {
                this.log(`${game.name} has mobile controls (${mobileControls.length} buttons)`, 'success');
                this.testResults.passed++;
            } else {
                this.log(`${game.name} missing mobile controls`, 'warning');
                this.testResults.warnings++;
            }
            
        } catch (error) {
            this.log(`${game.name} functionality test failed: ${error.message}`, 'error');
            this.testResults.failed++;
        } finally {
            await page.close();
            this.testResults.total++;
        }
    }

    async testGamePerformance(game) {
        const page = await this.browser.newPage();
        
        try {
            this.log(`Testing ${game.name} performance...`, 'info');
            
            // Enable performance monitoring
            await page.coverage.startJSCoverage();
            
            const startTime = Date.now();
            await page.goto(`http://localhost:8080/${game.file}`, {
                waitUntil: 'networkidle0',
                timeout: 15000
            });
            const loadTime = Date.now() - startTime;
            
            // Check memory usage
            const metrics = await page.metrics();
            
            // Stop coverage
            const jsCoverage = await page.coverage.stopJSCoverage();
            
            // Analyze results
            if (loadTime < 3000) {
                this.log(`${game.name} load time: ${loadTime}ms (Good)`, 'success');
                this.testResults.passed++;
            } else if (loadTime < 5000) {
                this.log(`${game.name} load time: ${loadTime}ms (Acceptable)`, 'warning');
                this.testResults.warnings++;
            } else {
                this.log(`${game.name} load time: ${loadTime}ms (Too slow)`, 'error');
                this.testResults.failed++;
            }
            
            // Check JS heap size
            if (metrics.JSHeapUsedSize < 50 * 1024 * 1024) { // 50MB
                this.log(`${game.name} memory usage: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB (Good)`, 'success');
            } else {
                this.log(`${game.name} memory usage: ${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB (High)`, 'warning');
                this.testResults.warnings++;
            }
            
        } catch (error) {
            this.log(`${game.name} performance test failed: ${error.message}`, 'error');
            this.testResults.failed++;
        } finally {
            await page.close();
            this.testResults.total++;
        }
    }

    async testMainMenu() {
        const page = await this.browser.newPage();
        
        try {
            this.log('Testing main menu...', 'info');
            
            await page.goto('http://localhost:8080/index.html', {
                waitUntil: 'networkidle0',
                timeout: 10000
            });
            
            // Check for game links
            const gameLinks = await page.$$('a[href*=".html"], .game-card, .game-button');
            
            if (gameLinks.length >= this.games.length) {
                this.log(`Main menu has ${gameLinks.length} game links`, 'success');
                this.testResults.passed++;
            } else {
                this.log(`Main menu missing game links (found ${gameLinks.length}, expected ${this.games.length})`, 'warning');
                this.testResults.warnings++;
            }
            
        } catch (error) {
            this.log(`Main menu test failed: ${error.message}`, 'error');
            this.testResults.failed++;
        } finally {
            await page.close();
            this.testResults.total++;
        }
    }

    async testNavigation() {
        const page = await this.browser.newPage();
        
        try {
            this.log('Testing cross-game navigation...', 'info');
            
            // Test navigation from main menu to each game
            for (const game of this.games.slice(0, 3)) { // Test first 3 to save time
                await page.goto('http://localhost:8080/index.html');
                
                // Look for link to the game
                const gameLink = await page.$(`a[href="${game.file}"], a[href*="${game.key}"]`);
                if (gameLink) {
                    await gameLink.click();
                    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
                    
                    const currentUrl = page.url();
                    if (currentUrl.includes(game.file)) {
                        this.log(`Navigation to ${game.name} successful`, 'success');
                    } else {
                        this.log(`Navigation to ${game.name} failed`, 'warning');
                        this.testResults.warnings++;
                    }
                }
            }
            
            this.testResults.passed++;
            
        } catch (error) {
            this.log(`Navigation test failed: ${error.message}`, 'error');
            this.testResults.failed++;
        } finally {
            await page.close();
            this.testResults.total++;
        }
    }

    async runGameSpecificTest(gameName) {
        this.log(`🎯 Running specific test for ${gameName}...`, 'info');
        
        const game = this.games.find(g => 
            g.name.toLowerCase().includes(gameName.toLowerCase()) ||
            g.key.toLowerCase().includes(gameName.toLowerCase())
        );
        
        if (!game) {
            this.log(`Game '${gameName}' not found`, 'error');
            return;
        }
        
        try {
            await this.startServer();
            await this.startBrowser();
            
            await this.testGameLoad(game);
            await this.testGameFunctionality(game);
            await this.testGamePerformance(game);
            
        } finally {
            await this.stopBrowser();
            await this.stopServer();
        }
        
        this.printResults();
    }

    printResults() {
        console.log('\n' + '='.repeat(50));
        console.log(chalk.bold.blue('           TEST RESULTS SUMMARY'));
        console.log('='.repeat(50));
        
        console.log(`${chalk.green('✅ Passed:')} ${this.testResults.passed}`);
        console.log(`${chalk.yellow('⚠️  Warnings:')} ${this.testResults.warnings}`);
        console.log(`${chalk.red('❌ Failed:')} ${this.testResults.failed}`);
        console.log(`${chalk.blue('📊 Total:')} ${this.testResults.total}`);
        
        const successRate = Math.round((this.testResults.passed / this.testResults.total) * 100);
        console.log(`${chalk.bold('Success Rate:')} ${successRate}%`);
        
        if (this.testResults.failed === 0 && this.testResults.warnings <= 2) {
            console.log(chalk.green.bold('\n🎉 ALL TESTS PASSED - READY FOR DEPLOYMENT!'));
        } else if (this.testResults.failed === 0) {
            console.log(chalk.yellow.bold('\n⚠️  TESTS PASSED WITH WARNINGS - REVIEW RECOMMENDED'));
        } else {
            console.log(chalk.red.bold('\n❌ TESTS FAILED - FIX ISSUES BEFORE DEPLOYMENT'));
        }
        
        console.log('='.repeat(50) + '\n');
    }
}

// CLI Setup
const program = new Command();
const runner = new GameTestRunner();

program
    .name('game-test-runner')
    .description('Automated testing framework for HTML5 games')
    .version('1.0.0');

program
    .option('-q, --quick', 'run quick tests only')
    .option('-g, --game <name>', 'test specific game')
    .option('-p, --performance', 'run performance tests only')
    .option('-w, --watch', 'watch for changes and re-run tests')
    .action(async (options) => {
        try {
            if (options.quick) {
                await runner.runQuickTests();
            } else if (options.game) {
                await runner.runGameSpecificTest(options.game);
            } else if (options.performance) {
                await runner.runPerformanceTests();
            } else {
                await runner.runFullTests();
            }
        } catch (error) {
            console.error(chalk.red(`Test runner error: ${error.message}`));
            process.exit(1);
        }
    });

program.parse();

// If no command provided, run full tests
if (!process.argv.slice(2).length) {
    runner.runFullTests();
}

module.exports = GameTestRunner;
