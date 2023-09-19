# JavaScript Snake Game

This is a DOM-based game of Snake that I wrote in JavaScript over a decade ago. It was made to have sort of a nostalgic feel to it.

## Play and Edit the Game Online!

You can now play and edit the game live in codesandbox:

https://codesandbox.io/s/github/patorjk/JavaScript-Snake?file=/index.html

On first load sometimes the game frame will not load correctly and you'll need to press the refresh icon above its display panel to get the game to show. 

Original game is located here:

http://patorjk.com/games/snake


## How to use
The index.html file should give an idea of how to use this code. However, below you can see how to initialize it into any div within a webpage.

    var mySnakeBoard = new SNAKE.Board( {
                                            boardContainer: "game-area",
                                            fullScreen: false,
                                            width: 580,
                                            height:400
                                        });
                                    
The comments within the source code are formatted a little strange because at the time I was playing around with YUI Doc which generates documentation from code. Kind of sucks that there's so much churn in the JavaScript world. However, I'm glad the rest of the code doesn't use any external libraries, as this game still works the same after over a decade.

## Contributors

Thanks goes to these people: ([emoji key](https://allcontributors.org/docs/en/emoji-key))

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://patorjk.com/"><img src="https://avatars.githubusercontent.com/u/521224?v=4?s=100" width="100px;" alt="patorjk"/><br /><sub><b>patorjk</b></sub></a><br /><a href="#code-patorjk" title="Code">💻</a> <a href="#doc-patorjk" title="Documentation">📖</a> <a href="#design-patorjk" title="Design">🎨</a> <a href="#bug-patorjk" title="Bug reports">🐛</a> <a href="#example-patorjk" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ultra17"><img src="https://avatars.githubusercontent.com/u/27869698?v=4?s=100" width="100px;" alt="ultra17"/><br /><sub><b>ultra17</b></sub></a><br /><a href="#code-ultra17" title="Code">💻</a> <a href="#doc-ultra17" title="Documentation">📖</a> <a href="#design-ultra17" title="Design">🎨</a> <a href="#bug-ultra17" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Rb64"><img src="https://avatars.githubusercontent.com/u/91498309?v=4?s=100" width="100px;" alt="Rb64"/><br /><sub><b>Rb64</b></sub></a><br /><a href="#code-Rb64" title="Code">💻</a> <a href="#bug-Rb64" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/legoman8304"><img src="https://avatars.githubusercontent.com/u/43346988?v=4?s=100" width="100px;" alt="Wyatt Nulton"/><br /><sub><b>Wyatt Nulton</b></sub></a><br /><a href="#code-legoman8304" title="Code">💻</a> <a href="#bug-legoman8304" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ashishsiot"><img src="https://avatars.githubusercontent.com/u/63919950?v=4?s=100" width="100px;" alt="Ashish Bhoir"/><br /><sub><b>Ashish Bhoir</b></sub></a><br /><a href="#doc-ashishsiot" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
