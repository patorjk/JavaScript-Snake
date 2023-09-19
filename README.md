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
      <td align="center" valign="top" width="14.28%"><a href="http://dginovker.github.io"><img src="https://avatars.githubusercontent.com/u/32943174?v=4?s=100" width="100px;" alt="Dan G"/><br /><sub><b>Dan G</b></sub></a><br /><a href="#code-dginovker" title="Code">💻</a> <a href="#bug-dginovker" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Megas4ever"><img src="https://avatars.githubusercontent.com/u/28103886?v=4?s=100" width="100px;" alt="Megas4ever"/><br /><sub><b>Megas4ever</b></sub></a><br /><a href="#code-Megas4ever" title="Code">💻</a> <a href="#design-Megas4ever" title="Design">🎨</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mamamia5x"><img src="https://avatars.githubusercontent.com/u/57536929?v=4?s=100" width="100px;" alt="Bugs Bunny"/><br /><sub><b>Bugs Bunny</b></sub></a><br /><a href="#code-mamamia5x" title="Code">💻</a> <a href="#bug-mamamia5x" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.jamescote.ca"><img src="https://avatars.githubusercontent.com/u/3276350?v=4?s=100" width="100px;" alt="James Cote"/><br /><sub><b>James Cote</b></sub></a><br /><a href="#code-Coteh" title="Code">💻</a> <a href="#bug-Coteh" title="Bug reports">🐛</a> <a href="#doc-Coteh" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://yokesharun.github.io/"><img src="https://avatars.githubusercontent.com/u/12830078?v=4?s=100" width="100px;" alt="Arun Yokesh"/><br /><sub><b>Arun Yokesh</b></sub></a><br /><a href="#code-yokesharun" title="Code">💻</a> <a href="#design-yokesharun" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/GregFrench"><img src="https://avatars.githubusercontent.com/u/17938510?v=4?s=100" width="100px;" alt="Greg French"/><br /><sub><b>Greg French</b></sub></a><br /><a href="#code-GregFrench" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/KT360"><img src="https://avatars.githubusercontent.com/u/31077743?v=4?s=100" width="100px;" alt="KT360"/><br /><sub><b>KT360</b></sub></a><br /><a href="#code-KT360" title="Code">💻</a> <a href="#design-KT360" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://thusal06.github.io/"><img src="https://avatars.githubusercontent.com/u/66709891?v=4?s=100" width="100px;" alt="Thusal Ranawaka"/><br /><sub><b>Thusal Ranawaka</b></sub></a><br /><a href="#code-Thusal06" title="Code">💻</a> <a href="#design-Thusal06" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Furtano"><img src="https://avatars.githubusercontent.com/u/4115133?v=4?s=100" width="100px;" alt="C. S."/><br /><sub><b>C. S.</b></sub></a><br /><a href="#code-Furtano" title="Code">💻</a> <a href="#design-Furtano" title="Design">🎨</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/akhill2606"><img src="https://avatars.githubusercontent.com/u/56164681?v=4?s=100" width="100px;" alt="Akhil Manohar"/><br /><sub><b>Akhil Manohar</b></sub></a><br /><a href="#code-akhill2606" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
