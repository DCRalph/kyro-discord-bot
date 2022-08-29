import command from '../command.js'
import util from '../util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(
    client,
    ['covid', 'virus', 'crona', 'rona'],
    'Covid stats in nz or other country',
    async (message) => {
      let [first, ...rest] = message.content.toLowerCase().split(' ')

      let country = rest.join('%20') || 'nz'
      country = country.toLowerCase()

      if (country == 'murica') country = 'usa'
      if (rest.join(' ') == 'froghat fan club') {
        const embed = new Discord.MessageEmbed()

        embed.setTitle(`COVID-19 in Froghat Fan Club`)
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
        embed.addField('Cases', `69420`, true)
        embed.addField('Deaths', `80085`, true)
        embed.addField('\u200b', '\u200b', true)
        embed.addField('Today Cases', `69696969`, true)
        embed.addField('Today Deaths', `420`, true)
        embed.addField('\u200b', '\u200b', true)
        embed.addField('Recovered', `-1000`, true)
        embed.addField('Active', `all of them`, true)
        embed.addField('\u200b', '\u200b', true)

        message.channel.send({
          embeds: [embed],
        })
        return
      }

      let url = `https://disease.sh/v3/covid-19/countries/${country}?strict=true`
      if (country == 'all')
        url = `https://disease.sh/v3/covid-19/all?strict=true`

      const req = await fetch(url)
      const data = await req.json()

      if (req.status != 200) {
        if (typeof data.message != 'undefined') {
          message.channel.send({
            content: data.message,
          })
        } else {
          throw new Error(`${req.status} ${url}`)
        }
        return
      }

      // console.log(data)

      const embed = new Discord.MessageEmbed()

      if (country != 'all') embed.setTitle(`COVID-19 in ${data.country}`)
      else embed.setTitle('COVID-19 in the world')
      if (country != 'all') embed.setThumbnail(data.countryInfo.flag)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.addField('Cases', `${data.cases}`, true)
      embed.addField('Deaths', `${data.deaths}`, true)
      embed.addField('\u200b', '\u200b', true)
      embed.addField('Today Cases', `${data.todayCases}`, true)
      embed.addField('Today Deaths', `${data.todayDeaths}`, true)
      embed.addField('\u200b', '\u200b', true)
      embed.addField('Recovered', `${data.recovered}`, true)
      embed.addField('Active', `${data.active}`, true)
      embed.addField('\u200b', '\u200b', true)

      message.channel.send({
        embeds: [embed],
      })
    }
  )
}
export { create }
